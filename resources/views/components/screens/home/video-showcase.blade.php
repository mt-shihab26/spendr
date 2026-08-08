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
    <button
        id="soundToggle"
        class="absolute inset-0 grid cursor-pointer place-items-center bg-black/30 transition-opacity duration-300"
        aria-label="Toggle sound"
    >
        <div class="relative grid size-24 place-items-center rounded-full bg-black/90">
            <div
                class="absolute inset-0 size-full animate-spin rounded-full border-2 border-solid border-primary border-t-transparent border-b-transparent"
                style="animation-duration: 3s;"
            ></div>
            <x-icons.play-solid class="size-9 text-primary" />
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
