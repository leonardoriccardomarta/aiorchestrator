const CTA: React.FC = () => {
  return (
    <section id="cta" className="mt-10 mb-5 lg:my-20">
      <div className="relative h-full w-full z-10 mx-auto py-12 sm:py-20">
        <div className="h-full w-full">
          <div className="rounded-3xl opacity-95 absolute inset-0 -z-10 h-full w-full bg-[#050a02] bg-[linear-gradient(to_right,#12170f_1px,transparent_1px),linear-gradient(to_bottom,#12170f_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="rounded-3xl absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_600px_at_50%_500px,#1C1C02,transparent)]"></div>
          </div>

          <div className="h-full flex flex-col items-center justify-center text-white text-center px-5">
            <h2 className="text-3xl md:text-5xl font-semibold mb-4 max-w-2xl">
              Start your 3-day free trial now
            </h2>
            <p className="mx-auto max-w-xl">
              Includes setup · 10k messages · Full dashboard access
            </p>
            <a
              href="/checkout.html"
              className="mt-6 inline-block px-6 py-3 text-sm font-semibold bg-white text-black rounded-full hover:bg-neutral-200"
            >
              Launch My Chatbot →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
