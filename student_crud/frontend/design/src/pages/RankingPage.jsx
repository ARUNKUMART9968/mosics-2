import { useState, useEffect } from "react";
import { getRanking } from "../api/api";

// Ranking page — shows students ranked by total marks
// Props:
//   toast - function(msg, type) to show notifications

function RankingPage({ toast }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRanking();
        setRanking(Array.isArray(data) ? data : []);
      } catch {
        toast("Failed to load rankings", "error");
      }
      setLoading(false);
    })();
  }, []);

  // Medal emoji for top 3
  const medal = (rank) =>
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;

  // CSS class for rank badge color
  const rankClass = (rank) =>
    rank === 1 ? "rank-1"
    : rank === 2 ? "rank-2"
    : rank === 3 ? "rank-3"
    : "rank-other";

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Rankings</div>
        <div className="page-sub">Students ranked by total marks (highest to lowest)</div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <span className="spinner" />
          </div>
        ) : ranking.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🏆</div>
            <p>No ranking data yet. Add marks for students first.</p>
          </div>
        ) : (
          ranking.map((s) => (
            <div className="rank-item" key={s.id}>

              {/* Rank badge */}
              <div className={`rank-num ${rankClass(s.rank)}`}>
                {medal(s.rank)}
              </div>

              {/* Student info + progress bar */}
              <div style={{ flex: 1 }}>
                <div className="rank-name">{s.name}</div>
                <div className="rank-reg">{s.regNo}</div>
                <div className="progress-bar" style={{ width: 200 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${s.marks?.percentage || 0}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div style={{ textAlign: "right" }}>
                <div className="rank-total">
                  {s.marks?.total || 0}
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>/500</span>
                </div>
                <div className="rank-pct">
                  {s.marks?.percentage?.toFixed(1) || 0}%
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RankingPage;