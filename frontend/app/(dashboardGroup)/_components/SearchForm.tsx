import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** A plain GET form - works without client JS and puts the query in the URL. */
export function SearchForm({ status, search }: { status: string; search?: string }) {
    return (

        <form action="/mentor-dashboard" className="flex gap-2">

            <input type="hidden" name="status" value={status} />

            <Input name="search" defaultValue={search} placeholder="Search project or student…" className="w-full sm:w-64" aria-label="Search submissions" />

            <Button type="submit" variant="outline" size="icon" aria-label="Search">
                <Search />
            </Button>

        </form>
    );
}