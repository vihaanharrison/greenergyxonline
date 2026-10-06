import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import RecordForm from "@/components/record/RecordForm";

export default function EditRecordSheet({ record, open, onOpenChange, onUpdated }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto border-border p-0">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-border">
          <SheetTitle className="font-display text-2xl">Edit record</SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            Update the details of this recycling contribution.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 py-5">
          {record && <RecordForm key={record.id} variant="full" initial={record} onDone={onUpdated} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}