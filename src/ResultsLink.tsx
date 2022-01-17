export function ResultsLink(props: { onPress: () => void }) {
  const { onPress } = props;

  return (
    <div className="gap-s center results-link">
      <button className="btn-l" onClick={onPress}>
        Statistik
      </button>
    </div>
  );
}
