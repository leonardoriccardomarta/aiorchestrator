import BenefitSection from "./BenefitSection";
import { benefits } from "@/data/benefits";

const Benefits: React.FC = () => {
  return (
    <section id="features" className="py-10 lg:py-20">
      <h2 className="sr-only">Features</h2>
      {benefits.map((item, index) => (
        <BenefitSection 
          key={index} 
          title={item.title}
          description={item.description}
          bullets={item.features.map((feature: string) => ({
            title: feature,
            description: feature,
            icon: item.icon
          }))}
        />
      ))}
    </section>
  );
};

export default Benefits;
