import gsap from "gsap";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const animatePageIn = () => {
  const banners = [
    document.getElementById("banner-1"),
    document.getElementById("banner-2"),
    document.getElementById("banner-3"),
    document.getElementById("banner-4"),
  ].filter(Boolean) as HTMLElement[];

  if (banners.length) {
    const tl = gsap.timeline();

    tl.set(banners, { yPercent: 0, display: "block" })
      .to(banners, {
        yPercent: 100,
        stagger: 0.25,
        ease: "bounce.out",
        duration: 0.6,
        onComplete: () => {
          gsap.set(banners, { display: "none" }); // hide after animation finishes
        },
      });
  }
};

export const animatePageOut = (href: string, router: AppRouterInstance): Promise<void> => {
  return new Promise((resolve) => {
    const banners = [
      document.getElementById("banner-1"),
      document.getElementById("banner-2"),
      document.getElementById("banner-3"),
      document.getElementById("banner-4"),
    ].filter(Boolean) as HTMLElement[];

    if (banners.length) {
      const tl = gsap.timeline({
        defaults: { ease: "bounce.out", duration: 0.6 },
        onComplete: () => {
          // 👇 Now only navigate AFTER the full animation finishes
          router.push(href);

          // Wait for the next page to mount, then hide banners (for mobile safety)
          setTimeout(() => {
            gsap.set(banners, { display: "none", clearProps: "all" });
            resolve();
          }, 800); // short buffer to ensure repaint on mobile
        },
      });

      tl.set(banners, { yPercent: -100, display: "block" })
        .to(banners, { yPercent: 0, stagger: 0.25 });
    } else {
      router.push(href);
      resolve();
    }
  });
};
