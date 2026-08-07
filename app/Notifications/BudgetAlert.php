<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BudgetAlert extends Notification
{
    use Queueable;

    /**
     * @param  string  $categoryName
     * @param  string  $currency
     * @param  float  $spent
     * @param  float  $budgetAmount
     * @param  int  $percentage
     * @param  int  $threshold  80 or 100
     * @param  string  $budgetId
     * @param  string  $month  Y-m format
     */
    public function __construct(
        public readonly string $categoryName,
        public readonly string $currency,
        public readonly float $spent,
        public readonly float $budgetAmount,
        public readonly int $percentage,
        public readonly int $threshold,
        public readonly string $budgetId,
        public readonly string $month,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->threshold >= 100
            ? "Budget exceeded: {$this->categoryName}"
            : "Budget at {$this->threshold}%: {$this->categoryName}";

        $message = $this->threshold >= 100
            ? "You have exceeded your {$this->currency} budget for {$this->categoryName}."
            : "You have used {$this->percentage}% of your {$this->currency} budget for {$this->categoryName}.";

        return (new MailMessage)
            ->subject($subject)
            ->greeting('Budget Alert')
            ->line($message)
            ->line('Spent: '.$this->currency.' '.number_format($this->spent, 2))
            ->line('Budget: '.$this->currency.' '.number_format($this->budgetAmount, 2))
            ->action('View Budget', url(route('budgets.show', $this->budgetId)));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'threshold' => $this->threshold,
            'percentage' => $this->percentage,
            'category' => $this->categoryName,
            'currency' => $this->currency,
            'spent' => $this->spent,
            'budget' => $this->budgetAmount,
            'budget_id' => $this->budgetId,
            'month' => $this->month,
        ];
    }
}
