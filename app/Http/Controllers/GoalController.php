<?php

namespace App\Http\Controllers;

use App\Http\Requests\Goals\StoreGoalRequest;
use App\Http\Requests\Goals\UpdateGoalRequest;
use App\Models\Goal;
use App\Models\User;
use App\Notifications\GoalMilestone;
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

        $this->notifyGoalMilestone($request->user(), $goal, 0);

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

        $previousPercentage = (int) $goal->progressPercentage();

        $goal->update($request->validated());

        $this->notifyGoalMilestone($request->user(), $goal, $previousPercentage);

        return redirect()
            ->back()
            ->with('success', 'Goal updated.');
    }

    /**
     * Fire a GoalMilestone notification if the goal crosses a milestone threshold.
     */
    private function notifyGoalMilestone(User $user, Goal $goal, int $previousPercentage): void
    {
        $currentPercentage = (int) $goal->progressPercentage();

        foreach ([25, 50, 75, 100] as $milestone) {
            if ($previousPercentage < $milestone && $currentPercentage >= $milestone) {
                $user->notify(new GoalMilestone($goal, $milestone));
                break;
            }
        }
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
