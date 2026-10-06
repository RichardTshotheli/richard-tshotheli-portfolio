import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  AttendancePanel,
  EquipmentPanel,
  LabDetailsPanel,
  LabStatusPanel,
  SoftwarePanel,
} from "@/components/lab-board/lab-panels";
import { useLabStore } from "@/components/lab-board/lab-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KIND_LABELS, peopleInside } from "@/lib/lab-board";

export const Route = createFileRoute("/labs/$labId")({
  component: LabDetailPage,
});

function LabDetailPage() {
  const { labId } = Route.useParams();
  const store = useLabStore();
  const navigate = useNavigate();

  if (!store.ready || !store.state) {
    return <p className="mx-auto max-w-6xl px-5 py-16 text-portfolio-mist sm:px-8">Loading the laboratory board…</p>;
  }

  const lab = store.state.labs.find((item) => item.id === labId);
  if (!lab) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-3xl font-semibold">Lab not found</h1>
        <p className="mt-3 text-portfolio-mist">That lab is not on the board.</p>
        <Link to="/labs" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">
          Back to all labs
        </Link>
      </main>
    );
  }

  const inside = peopleInside(store.state.attendance, lab.id).length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link to="/labs" className="text-sm font-medium text-primary hover:underline">
        All labs
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-teal">{KIND_LABELS[lab.kind]}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">{lab.name}</h1>
      <p className="mt-2 text-sm text-portfolio-mist">
        {lab.code ? `${lab.code} · ` : ""}
        {lab.location}
        {lab.location ? " · " : ""}
        {inside} of {lab.capacity} inside
      </p>
      {lab.description ? <p className="mt-4 max-w-2xl leading-relaxed text-foreground/85">{lab.description}</p> : null}

      <div className="mt-8">
        <LabStatusPanel key={`${lab.id}-status`} lab={lab} />
      </div>

      <Tabs defaultValue="attendance" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="attendance">Attendance ({inside})</TabsTrigger>
          <TabsTrigger value="equipment">Equipment ({lab.equipment.length})</TabsTrigger>
          <TabsTrigger value="software">Software ({lab.software.length})</TabsTrigger>
          <TabsTrigger value="details">Lab details</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="mt-5">
          <AttendancePanel key={`${lab.id}-attendance`} lab={lab} />
        </TabsContent>
        <TabsContent value="equipment" className="mt-5">
          <EquipmentPanel key={`${lab.id}-equipment`} lab={lab} />
        </TabsContent>
        <TabsContent value="software" className="mt-5">
          <SoftwarePanel key={`${lab.id}-software`} lab={lab} />
        </TabsContent>
        <TabsContent value="details" className="mt-5">
          <LabDetailsPanel key={`${lab.id}-details`} lab={lab} onRemoved={() => void navigate({ to: "/labs" })} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
