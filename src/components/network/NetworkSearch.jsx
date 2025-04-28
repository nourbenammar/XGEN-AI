import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NetworkSearch({
  searchTerm,
  onSearchChange,
  filterYear,
  onYearChange,
  filterDepartment,
  onDepartmentChange,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search connections by name, role, or company..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={filterYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Graduation Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          <SelectItem value="2020">2020</SelectItem>
          <SelectItem value="2019">2019</SelectItem>
          <SelectItem value="2018">2018</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="cs">Computer Science</SelectItem>
          <SelectItem value="business">Business Administration</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}