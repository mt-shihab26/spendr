<?php

namespace App\Http\Controllers;

use App\Http\Requests\Goals\StoreGoalRequest;
use App\Http\Requests\Goals\UpdateGoalRequest;
use App\Models\Goal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class GoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $goals = $request->user()
            ->goals()
            ->orderBy('created_at')
            ->get()
            ->map(fn (Goal $goal) => array_merge($goal->toArray(), [
                'progress_percentage' => $goal->progressPercentage(),
            ]));

        return inertia('goals/index', [
            'goals' => $goals,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return inertia('goals/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGoalRequest $request): RedirectResponse
    {
        $goal = $request->user()->goals()->create($request->validated());

        return redirect()
            ->route('goals.show', $goal)
            ->with('success', 'Goal created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Goal $goal): Response
    {
        abort_if($goal->user_id !== $request->user()->id, 403);

        return inertia('goals/show', [
            'goal' => array_merge($goal->toArray(), [
                'progress_percentage' => $goal->progressPercentage(),
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Goal $goal): Response
    {
        abort_if($goal->user_id !== $request->user()->id, 403);

        return inertia('goals/edit', [
            'goal' => $goal,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGoalRequest $request, Goal $goal): RedirectResponse
    {
        abort_if($goal->user_id !== $request->user()->id, 403);

        $goal->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Goal updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Goal $goal): RedirectResponse
    {
        abort_if($goal->user_id !== $request->user()->id, 403);

        $goal->delete();

        return redirect()
            ->route('goals.index')
            ->with('success', 'Goal deleted.');
    }
}
