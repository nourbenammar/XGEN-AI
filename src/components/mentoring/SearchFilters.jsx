import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchFilters({ onSearch, onFilterChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mentors by name, expertise, or company"
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select expertise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Expertise</SelectItem>
          <SelectItem value="ai">Artificial Intelligence</SelectItem>
          <SelectItem value="software">Software Development</SelectItem>
          <SelectItem value="leadership">Leadership</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="w-[120px]">
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}