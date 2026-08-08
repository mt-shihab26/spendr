<?php

namespace App\Notifications;

use App\Models\Goal;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GoalMilestone extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Goal $goal,
        public readonly int $milestone,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($notifiable->getPreference('notify_goal_milestones', true)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = $this->milestone >= 100
            ? "You've reached your goal: {$this->goal->name}!"
            : "You've reached {$this->milestone}% of your goal: {$this->goal->name}.";

        return (new MailMessage)
            ->subject("Goal milestone: {$this->goal->name}")
            ->greeting('Goal Progress')
            ->line($message)
            ->line("Progress: {$this->goal->current_amount} / {$this->goal->target_amount} {$this->goal->currency}")
            ->action('View Goal', url(route('goals.show', $this->goal->id)));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'goal_id' => $this->goal->id,
            'goal_name' => $this->goal->name,
            'milestone' => $this->milestone,
            'current_amount' => $this->goal->current_amount,
            'target_amount' => $this->goal->target_amount,
            'currency' => $this->goal->currency,
        ];
    }
}
