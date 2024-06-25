import { useUnitsStore } from "zustand/harbor/unitsStore";
import "./UnitsSearchInputBox.css";
import { useEffect } from "react";
import { debounce } from "lodash";

export default function UnitsSearchInputBox() {
    const { setFilterText, filterText, units,
        setFilteredUnits, } = useUnitsStore();


    useEffect(() => {
        if (filterText === '') {
            setFilteredUnits(units);
        } else {
            setFilteredUnits(filterUnits(filterText));
        }
    }, [filterText, units]);

    function filterUnits(search: string): any {
        return units.filter((unit:any) => {
            const unitString = JSON.stringify(unit).toLowerCase();
            return unitString.includes(search.toLowerCase());
        });
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    const debouncedSearch = debounce(handleSearchChange, 300);
    return (
        <div className="search h-[1.75rem]">
            <input placeholder="Search..." type="text" className="h-[1.75rem] rounded-md border-gray-500 border-[1px] border-md shadow-md outline-none focus:outline-none"
                onChange={debouncedSearch}
            />
            {/* <button type="submit" className="text-sm px-4 rounded-md bg-black h-[1.75rem] text-white hover:bg-white hover:text-gray-800 border-black border-[1px] border-md transition duration-300 ease-in-out font-medium" >Go</button> */}
        </div>
    )
}