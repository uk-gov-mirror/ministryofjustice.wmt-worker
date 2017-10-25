exports.seed = function (knex, Promise) {
  var sql = `CREATE VIEW app.national_caseload_view
      WITH SCHEMABINDING
      AS
      SELECT     
          0 AS id
        , r.id AS link_id
        , r.description AS name
        , grade_code
        , case_type
        , SUM([0]) AS untiered
        , SUM([1]) AS d2
        , SUM([2]) AS d1
        , SUM([3]) AS c2
        , SUM([4]) AS c1
        , SUM([5]) AS b2
        , SUM([6]) AS b1
        , SUM([7]) AS a
        , SUM([0] + [1] + [2] + [3] + [4] + [5] + [6] + [7]) AS total_cases
      FROM app.caseload_base_view AS total_per_workload WITH (NOEXPAND)
      PIVOT (
        SUM(tier_number_totals)
        FOR tier_number
        IN ([0],[1],[2],[3],[4],[5],[6],[7])
      ) AS pivoted
        JOIN app.team t ON t.id = pivoted.id
        JOIN app.ldu l ON l.id = t.ldu_id
        JOIN app.region r ON r.id = l.region_id
      GROUP BY r.id, r.description, pivoted.case_type, pivoted.grade_code;`

  return knex.schema
      .raw('DROP VIEW IF EXISTS app.national_caseload_view;')
      .raw('SET ARITHABORT ON')
      .raw(sql)
}
