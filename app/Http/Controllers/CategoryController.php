<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $categories = $request->user()
            ->categories()
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get();

        return inertia('categories/index', [
            'categories' => $categories,
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

        return inertia('categories/show', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Category $category): Response
    {
        abort_if($category->user_id !== $request->user()->id, 403);

        return inertia('categories/edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        abort_if($category->user_id !== $request->user()->id, 403);

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

        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category deleted.');
    }
}
