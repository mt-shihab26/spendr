<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Http\Requests\Budgets\StoreBudgetRequest;
use App\Http\Requests\Budgets\UpdateBudgetRequest;
use App\Models\Budget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $month = $request->input('month', now()->format('Y-m'));

        $budgets = $request->user()
            ->budgets()
            ->with('category')
            ->orderBy('created_at')
            ->get();

        $spending = $this->getSpending($request->user()->id, $month);

        $budgets = $budgets->map(fn (Budget $budget) => array_merge(
            $budget->toArray(),
            ['spent' => $spending->get($budget->category_id, [])],
        ));

        return inertia('budgets/index', [
            'budgets' => $budgets,
            'month' => $month,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $categories = $request->user()
            ->categories()
            ->where('type', Type::Expense->value)
            ->orderBy('sort_order')
            ->get();

        return inertia('budgets/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBudgetRequest $request): RedirectResponse
    {
        $request->user()->budgets()->create($request->validated());

        return redirect()
            ->route('budgets.index')
            ->with('success', 'Budget created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Budget $budget): Response
    {
        abort_if($budget->user_id !== $request->user()->id, 403);

        $month = $request->input('month', now()->format('Y-m'));

        $budget->load('category');

        $spending = $this->getSpending($request->user()->id, $month, $budget->category_id);

        return inertia('budgets/show', [
            'budget' => array_merge($budget->toArray(), ['spent' => $spending]),
            'month' => $month,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Budget $budget): Response
    {
        abort_if($budget->user_id !== $request->user()->id, 403);

        $categories = $request->user()
            ->categories()
            ->where('type', Type::Expense->value)
            ->orderBy('sort_order')
            ->get();

        return inertia('budgets/edit', [
            'budget' => $budget->load('category'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBudgetRequest $request, Budget $budget): RedirectResponse
    {
        abort_if($budget->user_id !== $request->user()->id, 403);

        $budget->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Budget updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Budget $budget): RedirectResponse
    {
        abort_if($budget->user_id !== $request->user()->id, 403);

        $budget->delete();

        return redirect()
            ->route('budgets.index')
            ->with('success', 'Budget deleted.');
    }

    /**
     * Get per-currency spending for the given month, grouped by category_id.
     * When $categoryId is provided, returns a flat currency => total array for that single category.
     *
     * @return Collection<string, array<string, float>>|array<string, float>
     */
    private function getSpending(string $userId, string $month, ?string $categoryId = null): Collection|array
    {
        [$year, $monthNum] = explode('-', $month);

        $query = DB::table('transactions')
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('transactions.user_id', $userId)
            ->where('transactions.type', Type::Expense->value)
            ->whereYear('transactions.transacted_at', (int) $year)
            ->whereMonth('transactions.transacted_at', (int) $monthNum)
            ->whereNull('transactions.deleted_at');

        if ($categoryId !== null) {
            return $query
                ->where('transactions.category_id', $categoryId)
                ->select('wallets.currency', DB::raw('SUM(transactions.amount) as total'))
                ->groupBy('wallets.currency')
                ->pluck('total', 'currency')
                ->toArray();
        }

        return $query
            ->select('transactions.category_id', 'wallets.currency', DB::raw('SUM(transactions.amount) as total'))
            ->groupBy('transactions.category_id', 'wallets.currency')
            ->get()
            ->groupBy('category_id')
            ->map(fn ($rows) => $rows->pluck('total', 'currency')->toArray());
    }
}
