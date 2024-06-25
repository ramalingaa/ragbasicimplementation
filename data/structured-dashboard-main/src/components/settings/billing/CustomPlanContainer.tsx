'use client';

export default function CustomPlanContainer() {

  return (
        <div className="bg-gray-50 sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Custom Plan</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Do your business needs extend beyond our Growth Tier? We recognize that one size doesn't always fit all. That's why we offer custom solutions tailored to the unique demands of your enterprise. Contact <a href="mailto:sales@structuredlabs.io">sales@structuredlabs.io</a> to get started today.</p>
            </div>
            <div className="mt-5">
              <a
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                href='mailto:sales@structuredlabs.io'
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
    
  );
}
