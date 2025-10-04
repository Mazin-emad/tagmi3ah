import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
const SearchSection = () => {
  return (
    <section>
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Products You'll Love
        </h2>
        <form className="flex w-full gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">All Products</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>CPUs</DropdownMenuItem>
                <DropdownMenuItem>GPUs</DropdownMenuItem>
                <DropdownMenuItem>Motherboards</DropdownMenuItem>
                <DropdownMenuItem>RAM</DropdownMenuItem>
                <DropdownMenuItem>Storage</DropdownMenuItem>
                <DropdownMenuItem>Cooling</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input type="text" placeholder="Search" />
          <Button variant="default">Search</Button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
