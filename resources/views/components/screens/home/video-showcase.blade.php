<div
    class="relative mx-auto mt-16 w-full overflow-hidden border border-border shadow-2xl shadow-black/10 dark:shadow-black/40"
    data-video-showcase
>
    <div class="aspect-video w-full">
        <iframe
            id="ytPlayer"
            class="h-full w-full"
            src="https://www.youtube.com/embed/SZrDEUldGr0?autoplay=1&mute=1&loop=1&playlist=SZrDEUldGr0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1"
            allow="autoplay; encrypted-media"
            allowfullscreen
            title="{{ config('app.name') }} demo"
        ></iframe>
    </div>

    {{-- Sound toggle overlay — transparent when unmuted but stays clickable --}}
    <button
        id="soundToggle"
        class="absolute inset-0 grid cursor-pointer place-items-center bg-black/30 transition-opacity duration-300"
        aria-label="Toggle sound"
    >
        <div class="relative grid size-24 place-items-center rounded-full bg-black/90">
            {{-- Spinning ring --}}
            <div
                class="absolute inset-0 size-full animate-spin rounded-full border-2 border-solid border-primary border-t-transparent border-b-transparent"
                style="animation-duration: 3s;"
            ></div>
            {{-- Play icon --}}
            <svg class="size-9" fill="none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M20.9108 9.50547C23.3603 10.897 25.2851 11.9905 26.6564 12.9922C28.037 14.0008 29.0582 15.0549 29.4239 16.4448C29.6921 17.4639 29.6921 18.5361 29.4239 19.5552C29.0582 20.9451 28.037 21.9991 26.6564 23.0077C25.2851 24.0094 23.3603 25.1029 20.9109 26.4945C18.5448 27.8386 16.5495 28.9722 15.0348 29.6166C13.508 30.2659 12.1159 30.5952 10.763 30.2118C9.76878 29.9299 8.86412 29.3952 8.13534 28.6599C7.14629 27.6621 6.74927 26.2828 6.56144 24.6231C6.37497 22.9753 6.37499 20.8185 6.375 18.0751V17.9248C6.37499 15.1815 6.37497 13.0246 6.56144 11.3769C6.74927 9.71712 7.14629 8.33789 8.13534 7.34C8.86412 6.60473 9.76878 6.06996 10.763 5.78822C12.1159 5.40485 13.508 5.73401 15.0348 6.38345C16.5495 7.02771 18.5448 8.16123 20.9108 9.50547Z"
                    fill="var(--color-primary)"
                ></path>
            </svg>
        </div>
    </button>
</div>

<script>
    (function () {
        const iframe = document.getElementById('ytPlayer');
        const toggle = document.getElementById('soundToggle');
        let muted = true;

        toggle.addEventListener('click', function () {
            if (muted) {
                iframe.contentWindow.postMessage(
                    '{"event":"command","func":"unMute","args":""}',
                    '*',
                );
                toggle.classList.add('opacity-0');
                muted = false;
            } else {
                iframe.contentWindow.postMessage(
                    '{"event":"command","func":"mute","args":""}',
                    '*',
                );
                toggle.classList.remove('opacity-0');
                muted = true;
            }
        });
    })();
</script>
