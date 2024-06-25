const planDescriptions: { [key: string]: string } = {
  Starter: `Dive into Structured with essential features, including access to Harbor for data storage and integration, basic use of Queries for data exploration, collaborative capabilities in Reports for up to 5 projects, and the creation of up to 2 automation Blocks. Enjoy 5GB data storage, 500 Queries, and community support with comprehensive documentation.`,
  growth: `Customizable API generation, create up to 50 APIs, enjoy 10,000 monthly calls, direct email support for quick responses, and advanced analytics with 10GB data retention.`,
};

const CurrentPlanContainer = () => {

  const userPlan = 'Starter';

  // Get the appropriate description or a default message
  const description = userPlan
    ? planDescriptions[userPlan]
    : 'Loading plan details...';

  return (
    <div className="flex flex-col p-5 rounded-md w-full bg-white">
      <div className="text-left w-full">
        <h2 className="text-md mb-2 font-semibold text-gray-400">
          Your Current Plan
        </h2>
        <h1 className="text-3xl mb-5 capitalize font-bold">
          {userPlan
            ? userPlan
            : 'Loading...'}
        </h1>
        <p className="text-sm text-gray-700">
          {description || 'No description available for this plan.'}
        </p>
        <hr className="mt-4 w-full" />
      </div>
    </div>
  );
};

export default CurrentPlanContainer;
