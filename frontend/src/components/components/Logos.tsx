const Logos: React.FC = () => {
  return (
    <section id="logos" className="py-24 px-5 bg-background">
      <p className="text-lg font-medium text-center text-muted-foreground">
        Trusted by <span className="text-foreground font-semibold">2,000+</span> Shopify brands worldwide
      </p>
      <div className="mt-8 w-full flex flex-wrap items-center justify-center gap-8 opacity-60">
        <img src="/logos/shopify.svg" alt="Shopify" className="h-8" />
        <img src="/logos/stripe.svg" alt="Stripe" className="h-6" />
        <img src="/logos/slack.svg" alt="Slack" className="h-6" />
        <img src="/logos/notion.svg" alt="Notion" className="h-6" />
      </div>
    </section>
  );
};

export default Logos;
