import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/ui/hero-gallery-scroll-animation"
import { Button } from "@/components/ui/button"

const STORAGE_IMAGES = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80", // Jewelry storage
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80", // Jewelry display
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80", // Bangles
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80", // Ring storage
  "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80", // Gold jewelry
]

const HeroGalleryDemo1 = () => {
  return (
    <ContainerScroll className="h-[350vh]">
      <BentoGrid className="sticky left-0 top-0 z-0 h-screen w-full p-4">
        {STORAGE_IMAGES.map((imageUrl, index) => (
          <BentoCell
            key={index}
            className="overflow-hidden rounded-xl shadow-xl"
          >
            <img
              className="size-full object-cover object-center"
              src={imageUrl}
              alt="Sister Storage jewelry organization"
            />
          </BentoCell>
        ))}
      </BentoGrid>

      <ContainerScale className="relative z-10 text-center">
        <h1 className="max-w-xl text-5xl font-bold tracking-tighter text-foreground">
          Storage with Soul
        </h1>
        <p className="my-6 max-w-xl text-sm text-muted-foreground md:text-base">
          Discover storage that's designed for your bangles, jewelry, and keepsakes — 
          made with the details that matter most to your cultural heritage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="default" className="px-6 py-3 font-medium">
            Shop Now
          </Button>
          <Button variant="outline" className="px-6 py-3 font-medium">
            Learn More
          </Button>
        </div>
      </ContainerScale>
    </ContainerScroll>
  )
}

const HeroGalleryDemo2 = () => {
  return (
    <ContainerScroll className="h-[350vh]">
      <BentoGrid
        variant="fourCells"
        className="sticky left-0 top-0 h-svh w-full p-4"
      >
        {STORAGE_IMAGES.filter((_, index) => index <= 3).map((imageUrl, index) => (
          <BentoCell
            key={index}
            className="overflow-hidden rounded-xl shadow-xl"
          >
            <img
              className="size-full object-cover object-center"
              width="100%"
              height="100%"
              src={imageUrl}
              alt="Sister Storage jewelry organization"
            />
          </BentoCell>
        ))}
      </BentoGrid>
      <ContainerScale className="text-center">
        <h1 className="max-w-xl text-5xl font-bold tracking-tighter text-foreground">
          Handcrafted with Love
        </h1>
        <p className="my-6 max-w-xl text-sm text-muted-foreground md:text-base">
          Every piece is designed with intention, crafted for your cultural heritage 
          and the precious memories you hold dear.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="pink" className="px-6 py-3 font-medium">
            Explore Collection
          </Button>
          <Button variant="outline" className="px-6 py-3 font-medium">
            Our Story
          </Button>
        </div>
      </ContainerScale>
    </ContainerScroll>
  )
}

const HeroGalleryDemo3 = () => {
  return (
    <ContainerScroll className="h-[350vh] bg-background text-foreground">
      <BentoGrid
        variant="threeCells"
        className="sticky left-0 top-0 h-svh w-full p-4"
      >
        {STORAGE_IMAGES.filter((_, index) => index <= 2).map((imageUrl, index) => (
          <BentoCell
            key={index}
            className="overflow-hidden rounded-xl shadow-xl"
          >
            <img
              className="size-full object-cover object-center"
              width="100%"
              height="100%"
              src={imageUrl}
              alt="Sister Storage jewelry organization"
            />
          </BentoCell>
        ))}
      </BentoGrid>
      <ContainerScale className="text-center">
        <h1 className="max-w-xl text-5xl font-bold tracking-tighter">
          Designed for Heritage
        </h1>
        <p className="my-6 max-w-xl text-sm opacity-80 md:text-base">
          Storage solutions that honor your traditions and keep your most 
          treasured pieces beautifully organized.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="primary-inverse" className="px-6 py-3 font-medium">
            Shop Collection
          </Button>
          <Button variant="ghost" className="px-6 py-3 font-medium">
            View Catalog
          </Button>
        </div>
      </ContainerScale>
    </ContainerScroll>
  )
}

export { HeroGalleryDemo1, HeroGalleryDemo2, HeroGalleryDemo3 }