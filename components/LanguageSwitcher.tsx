import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/lib/languages";
import { Input } from "@/components/ui/input";

export const LanguageSwitcher = () => {
  const { setLanguage, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <Input
          placeholder="Search language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        {languages
          .filter((lang) =>
            lang.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
