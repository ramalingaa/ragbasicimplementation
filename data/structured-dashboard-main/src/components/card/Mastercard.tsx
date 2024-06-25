// Custom components
import Card from 'components/card/Card'

// Assets
import bgMastercard from 'img/dashboards/Debit.png'
import { RiMastercardFill } from 'react-icons/ri'

export default function Banner(props: {
  exp: string;
  cvv: string;
  number: string;
}) {
  const { exp, cvv, number, ...rest } = props;

  return (
    <Card
      className="bg-cover bg-no-repeat self-center w-full md:w-3/5 xl:w-11/12 bg-[10%] mx-auto p-5"
      style={{ backgroundImage: `url(${bgMastercard})` }}
      {...rest}
    >
      <div className="flex flex-col text-white h-full w-full">
        <div className="flex justify-between items-center mb-9">
          <span className="text-2xl font-bold">
            Glassy.
          </span>
          <RiMastercardFill className="w-12 h-auto text-gray-400" />
        </div>
        <div className="flex-grow"></div>
        <div className="flex flex-col">
          <div>
            <span className="text-xl font-bold sm:text-xl lg:text-lg xl:text-xl">
              {number}
            </span>
          </div>
          <div className="flex mt-3.5">
            <div className="flex flex-col mr-8.5">
              <span className="text-xs">VALID THRU</span>
              <span className="text-sm font-medium">
                {exp}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs">CVV</span>
              <span className="text-sm font-medium">
                {cvv}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
