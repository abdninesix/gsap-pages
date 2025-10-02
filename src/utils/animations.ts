import gsap from "gsap"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const animatePageIn = () => {
  const bannerOne = document.getElementById("banner-1")
  const bannerTwo = document.getElementById("banner-2")
  const bannerThree = document.getElementById("banner-3")
  const bannerFour = document.getElementById("banner-4")

  if (bannerOne && bannerTwo && bannerThree && bannerFour) {
    const tl = gsap.timeline()

    tl.set([bannerOne, bannerTwo, bannerThree, bannerFour], {
        yPercent: 0,
    }).to([bannerOne, bannerTwo, bannerThree, bannerFour], {
        yPercent: 100,
        stagger: 0.25,
        ease: "power2.inOut",
    })
  }
}

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
        onComplete: () => {
          router.push(href);
          resolve(); // resolves promise when animation and navigation are done
        },
      });

      tl.set(banners, { yPercent: -100 }).to(banners, {
        yPercent: 0,
        stagger: 0.25,
        ease: "power2.inOut",
      });
    } else {
      // if banners not found, just navigate immediately
      router.push(href);
      resolve();
    }
  });
};