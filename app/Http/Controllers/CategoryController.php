<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'type' => ['nullable', 'string', Rule::in(['income', 'expense'])],
        ]);

        $categories = $request->user()
            ->categories()
            ->withStats()
            ->when($validated['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get();

        [$year, $monthNum] = explode('-', now()->format('Y-m'));

        $monthSpending = DB::table('transactions')
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('transactions.user_id', $request->user()->id)
            ->whereYear('transactions.transacted_at', (int) $year)
            ->whereMonth('transactions.transacted_at', (int) $monthNum)
            ->whereNull('transactions.deleted_at')
            ->select('transactions.category_id', 'wallets.currency', DB::raw('SUM(transactions.amount) as total'))
            ->groupBy('transactions.category_id', 'wallets.currency')
            ->get()
            ->groupBy('category_id')
            ->map(fn ($rows) => $rows->pluck('total', 'currency')->toArray());

        $categories = $categories->map(fn (Category $category) => array_merge(
            $category->toArray(),
            ['month_spent' => $monthSpending->get($category->id, [])],
        ));

        return inertia('categories/index', [
            'categories' => $categories,
            'filters' => [
                'type' => $validated['type'] ?? null,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return inertia('categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $category = $request->user()->categories()->create($request->validated());

        return redirect()
            ->route('categories.show', $category)
            ->with('success', 'Category created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Category $category): Response
    {
        abort_if($category->user_id !== $request->user()->id, 403);

        $category->loadStats();

        $transactions = Inertia::scroll(
            $category->transactions()
                ->with(['wallet'])
                ->orderByDesc('transacted_at')
                ->orderByDesc('created_at')
                ->paginate(20)
        );

        return inertia('categories/show', [
            'category' => $category,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Category $category): Response
    {
        abort_if($category->user_id !== $request->user()->id, 403);

        $category->loadStats();

        $replacementCategories = $request->user()
            ->categories()
            ->where('type', $category->getRawOriginal('type'))
            ->where('id', '!=', $category->id)
            ->orderBy('sort_order')
            ->get();

        return inertia('categories/edit', [
            'category' => $category,
            'replacement_categories' => $replacementCategories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        abort_if($category->user_id !== $request->user()->id, 403);

        if ($request->filled('type') && $request->input('type') !== $category->getRawOriginal('type') && $category->transactions()->exists()) {
            return back()->withErrors(['type' => 'Cannot change type when the category has transactions.']);
        }

        $category->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Category updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_if($category->is_default, 403);
        abort_if($category->user_id !== $request->user()->id, 403);

        if ($category->transactions()->exists()) {
            $request->validate([
                'replacement_id' => [
                    'required',
                    'uuid',
                    Rule::exists('categories', 'id')
                        ->where('user_id', $request->user()->id)
                        ->where('type', $category->getRawOriginal('type')),
                ],
            ]);

            $category->transactions()->update(['category_id' => $request->input('replacement_id')]);
        }

        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category deleted.');
    }
}
