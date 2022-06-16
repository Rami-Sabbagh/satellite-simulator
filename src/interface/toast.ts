/**
 * Reference URLs:
 * FLIP technique: https://aerotwist.com/blog/flip-your-animations/
 * Why FLIP is useful: https://www.joshwcomeau.com/react/animating-the-unanimatable/
 * Creating a toast component: https://web.dev/building-a-toast-component/
 */

type ToastType = "danger" | "satellite-boom";

import 'styles/toasts.css';

export default class Toaster {
	private toastContainer: HTMLElement;

    /**
     * How long the toast stays in the page before removing it.
     */
    private toastDuration = "4s";

	constructor() {
		this.toastContainer = document.createElement('section');
		this.toastContainer.classList.add('toast-container');
        this.toastContainer.style.setProperty('--duration', this.toastDuration);
		document.body.append(this.toastContainer);

		window.addEventListener('click', () => {
			this.toast('Adios satellite #1.', "satellite-boom");
		});

        window.addEventListener('keydown', (event) => {
            // if key == 'a' then toast
            if (event.key == 'a') {
                this.toast("FPS is low. Stop adding new satellites.", "danger")
            }
        })
	}

	/**
	 * Creates a DOM node representing a toast.
	 */
	private createToast(text: string, type: ToastType) {
		const toast = document.createElement("output");

		toast.innerText = text;
		toast.classList.add('toast');
        toast.classList.add(`toast--${type}`);
		toast.setAttribute('role', 'status');

		return toast;
	}

	private addToastAndAnimateContainer(toast: HTMLElement) {
		const heightBeforeAppending = this.toastContainer.offsetHeight;
		this.toastContainer.appendChild(toast);

		const heightAfterAppending = this.toastContainer.offsetHeight;
		const heightDifference = heightAfterAppending - heightBeforeAppending;

		const keyframes = [
			{ transform: `translateY(${heightDifference}px)` },
			{ transform: 'translateY(0)' },
		];
		this.toastContainer.animate(keyframes, {
			duration: 150,
			easing: 'ease-out',
		});
	}

	/**
	 * Adds a toast to the toasts container.
	 * @param toast
	 */
	private addToast(toast: HTMLElement) {
		/**
		 * Animate the toast container if it has previous children,
		 * otherwise just append the toast.
		 */
		if (this.toastContainer.children.length)
			this.addToastAndAnimateContainer(toast);
		else this.toastContainer.append(toast);
	}

	/**
	 * Displays a new toast on the screen.
	 */
	public async toast(text: string, type: ToastType = "danger") {
		const toast = this.createToast(text, type);
		this.addToast(toast);

		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve) => {
            // Wait until all CSS animations are done then remove it from the DOM.
			await Promise.allSettled(
				toast.getAnimations().map((animation) => animation.finished)
			);
			this.toastContainer.removeChild(toast);
			resolve(undefined);
		});
	}
}
