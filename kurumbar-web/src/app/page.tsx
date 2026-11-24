export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl border border-border bg-surface p-8 shadow-sm sm:p-12">
        <span className="inline-flex items-center rounded-full bg-accent-yellow px-3.5 py-1 text-xs font-bold tracking-wide text-primary-dark">
          KURUMBAR • குரும்பர்
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
          Kurumbar Community Digital Platform
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Connecting and empowering the Kurumbar community with verified member
          registration, community announcements, gallery, and member services at{" "}
          <span className="font-semibold text-primary">www.kurumbar.org</span>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#registration"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
          >
            Member Registration
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/5"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
