export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="flex h-full flex-col items-center justify-center">
        {children}
      </section>
    </>
  );
}
