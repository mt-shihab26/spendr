<?php

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
        Schema::create('transfers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('from_wallet_id')->constrained('wallets')->restrictOnDelete();
            $table->foreignUuid('to_wallet_id')->constrained('wallets')->restrictOnDelete();
            $table->decimal('amount', 15, 2);
            $table->dateTime('transacted_at');
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
            $table->index(['user_id', 'transacted_at']);
            $table->index('from_wallet_id');
            $table->index('to_wallet_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
