<?php

namespace App\Notifications;

use App\Models\RecurringTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RecurringTransactionReminder extends Notification
{
    use Queueable;

    public function __construct(
        public readonly RecurringTransaction $recurring,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($notifiable->getPreference('notify_recurring_reminders', true)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Recurring transaction processed: {$this->recurring->description}")
            ->greeting('Recurring Transaction')
            ->line("Your recurring {$this->recurring->type->value} \"{$this->recurring->description}\" has been automatically processed.")
            ->line("Amount: {$this->recurring->amount}")
            ->line("Next due: {$this->recurring->next_due_at->toFormattedDateString()}")
            ->action('View Recurring Transactions', url(route('recurring-transactions.index')));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'recurring_id' => $this->recurring->id,
            'description' => $this->recurring->description,
            'type' => $this->recurring->type->value,
            'amount' => $this->recurring->amount,
            'frequency' => $this->recurring->frequency,
            'next_due_at' => $this->recurring->next_due_at->toDateString(),
        ];
    }
}
