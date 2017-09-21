exports.seed = function (knex, Promise) {
  var sql = `CREATE VIEW app.region_caseload_view
        WITH SCHEMABINDING
        AS
        SELECT     
          MAX(l.region_id) AS id
          , l.id AS link_id
          , MAX(l.description) AS name
          , case_type
          , SUM(untiered) AS untiered
          , SUM(d2) AS d2
          , SUM(d1) AS d1
          , SUM(c2) AS c2
          , SUM(c1) AS c1
          , SUM(b2) AS b2
          , SUM(b1) AS b1
          , SUM(a) AS a
          , SUM(total_cases) AS total_cases
        FROM app.ldu_caseload_view lv  
          JOIN app.ldu l ON lv.id = l.id
        GROUP BY l.id, lv.case_type;`

  return knex.schema
      .raw('DROP VIEW IF EXISTS app.region_caseload_view;')
      .raw('SET ARITHABORT ON')
      .raw(sql)
}
