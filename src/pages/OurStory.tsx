import BaseLayout from "@/components/layout/BaseLayout";

const OurStory = () => {
  return (
    <BaseLayout variant="standard" pageId="our-story">
      <section aria-label="Our Story" className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Our Story</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Built by sisters, for sisters. We set out to solve a simple problem: beautifully organizing what matters to us—without the clutter.
          </p>
          <p className="text-gray-700 leading-relaxed">
            From kitchen tables to studios, we designed, tested, and refined each detail so it fits our culture and our homes. This is more than storage—it’s a way to keep our stories visible, cared for, and ready for every day.
          </p>
        </div>
      </section>
    </BaseLayout>
  );
};

export default OurStory;
