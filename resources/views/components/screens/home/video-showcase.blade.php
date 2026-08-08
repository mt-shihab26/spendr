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
        aria-label="Unmute video"
    >
        <div
            class="relative grid size-24 place-items-center rounded-full bg-black/90"
        >
            <div
                class="absolute inset-0 size-full animate-spin rounded-full border-2 border-solid border-primary border-t-transparent border-b-transparent"
                style="animation-duration: 3s"
            ></div>
            <x-icons.play-solid class="size-9 text-primary" />
        </div>
    </button>
    <button
        id="muteBtn"
        class="absolute top-3 right-3 hidden size-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-opacity duration-300 hover:bg-black/80"
        aria-label="Mute video"
    >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 4.5C13 3.67 12.0237 3.25 11.4142 3.8358L6.70711 8.5H4C3.44772 8.5 3 8.9477 3 9.5v5c0 .5523.44772 1 1 1h2.70711l4.7071 4.6642C12.0237 20.75 13 20.33 13 19.5v-15Z" fill="currentColor" />
            <path d="M16.5 9.5a.75.75 0 0 1 1.06 0l1.19 1.19 1.19-1.19a.75.75 0 1 1 1.06 1.06L19.81 11.75l1.19 1.19a.75.75 0 1 1-1.06 1.06l-1.19-1.19-1.19 1.19a.75.75 0 1 1-1.06-1.06l1.19-1.19-1.19-1.19a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
        </svg>
    </button>
</div>

<script>
    (function () {
        const iframe = document.getElementById('ytPlayer');
        const toggle = document.getElementById('soundToggle');
        const muteBtn = document.getElementById('muteBtn');
        let muted = true;
        function unmute() {
            iframe.contentWindow.postMessage(
                '{"event":"command","func":"unMute","args":""}',
                '*',
            );
            toggle.classList.add('opacity-0', 'pointer-events-none');
            muteBtn.classList.remove('hidden');
            muteBtn.classList.add('flex');
            muted = false;
        }
        function mute() {
            iframe.contentWindow.postMessage(
                '{"event":"command","func":"mute","args":""}',
                '*',
            );
            toggle.classList.remove('opacity-0', 'pointer-events-none');
            muteBtn.classList.add('hidden');
            muteBtn.classList.remove('flex');
            muted = true;
        }
        toggle.addEventListener('click', unmute);
        muteBtn.addEventListener('click', mute);
    })();
</script>
