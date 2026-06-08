type LoadingProps = {
  label?: string;
};

export const Loading = ({ label = 'Scanning...' }: LoadingProps) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-900 border-t-transparent" />
      {label}
    </div>
  );
};
