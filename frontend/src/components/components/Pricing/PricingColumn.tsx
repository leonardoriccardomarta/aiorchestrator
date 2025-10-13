import clsx from "clsx";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { PricingTier } from "../../../data/pricing";

interface Props {
  tier: PricingTier;
  highlight?: boolean;
  isYearly?: boolean;
}

const PricingColumn: React.FC<Props> = ({ tier, highlight }) => {
  const { name, price, features } = tier;

  return (
    <div
      className={clsx(
        "w-full max-w-sm mx-auto rounded-xl border border-border bg-card text-foreground lg:max-w-full transition-shadow duration-300",
        {
          "shadow-xl ring-1 ring-primary": highlight,
        }
      )}
    >
      <div className="p-6 border-b border-border rounded-t-xl">
        <h3 className="text-2xl font-semibold mb-4">{name}</h3>
        <p className="text-3xl md:text-5xl font-bold mb-6">
          <span className={clsx({ "text-primary": highlight })}>
            {typeof price === "number" ? `$${price}` : price}
          </span>
          {typeof price === "number" && (
            <span className="text-lg font-normal text-muted ml-1">/mo</span>
          )}
        </p>

        {/* 🔁 Mostra sempre il bottone, ma cambia solo lo stile se è highlight */}
        <button
          aria-label={`Start ${name} plan`}
          className={clsx(
            "w-full py-3 px-4 rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            {
              "bg-primary text-white hover:bg-primary/90": highlight,
              "bg-muted text-foreground hover:bg-muted/90": !highlight,
            }
          )}
        >
          Get Started
        </button>
      </div>

      <div className="p-6 mt-1">
        <p className="font-bold mb-0">FEATURES</p>
        <p className="text-muted mb-5">Everything in basic, plus...</p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <BsFillCheckCircleFill className="h-5 w-5 text-secondary mr-2" />
              <span className="text-foreground-accent">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingColumn;
