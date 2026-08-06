<?php

use App\Enums\Type;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('wallet_id')->constrained()->restrictOnDelete();
            $table->foreignUuid('category_id')->constrained()->restrictOnDelete();
            $table->string('type')->default(Type::Expense->value);
            $table->decimal('amount', 15, 2);
            $table->date('transacted_at');
            $table->string('description');
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
            $table->index(['user_id', 'transacted_at']);
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'category_id']);
            $table->index('wallet_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
