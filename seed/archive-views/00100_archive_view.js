exports.seed = function (knex, Promise) {
  var view = `CREATE VIEW archive_view
    WITH SCHEMABINDING 
    AS 
    SELECT
      om.UniqueIdentifier AS unique_identifier
    , ouLdu.Name AS ldu_name
    , ouTeam.Name AS team_name
    , CONCAT(om.Forename, \' \', om.Surname) AS om_name
    , w.TotalCases AS total_cases
    , w.TotalPoints AS total_points
    , w.NominalTarget AS nominal_target
    , w.ContractedHoursPerWeek AS contracted_hours 
    , w.hoursReduction AS hours_reduction
    , n.HoursReduced AS reduction
    , n.Notes AS comments
    FROM dbo.OffenderManager om
      LEFT JOIN dbo.Note n ON om.Id = n.OffenderManagerId
      JOIN dbo.Workload w ON om.Id = w.OffenderManagerId
      JOIN dbo.OrganisationalUnit ouTeam ON w.TeamId = ouTeam.Id 
      JOIN dbo.OrganisationalUnit ouLdu ON w.LduId = ouLdu.Id
      GROUP BY om.UniqueIdentifier, ouLdu.Name, ouTeam.Name, CONCAT(om.Forename, \' \', om.Surname), w.TotalCases, 
      w.TotalPoints, w.NominalTarget, w.ContractedHoursPerWeek, w.hoursReduction, n.HoursReduced, n.Notes;`

  var view2 = `SELECT 
      om.UniqueIdentifier AS unique_identifier
      , ouLdu.Name AS ldu_name
      , ouTeam.Name AS team_name
      , CONCAT(om.Forename, \' \', om.Surname) AS om_name
      , w.TotalCases AS total_cases
      , w.TotalPoints AS total_points
      , w.NominalTarget AS nominal_target
      , w.ContractedHoursPerWeek AS contracted_hours 
      , w.hoursReduction AS hours_reduction
      , n.HoursReduced AS reduction
      , n.Notes AS comments
      FROM dbo.OffenderManager om, dbo.Note n
      JOIN dbo.Workload w ON om.Id = w.OffenderManagerId
      JOIN dbo.OrganisationalUnit ouTeam ON w.TeamId = ouTeam.Id 
      JOIN dbo.OrganisationalUnit ouLdu ON w.LduId = ouLdu.Id
      WHERE om.Id = n.OffenderManagerId
      UNION ALL
      SELECT
      om.UniqueIdentifier AS unique_identifier
      , ouLdu.Name AS ldu_name
      , ouTeam.Name AS team_name
      , CONCAT(om.Forename, \' \', om.Surname) AS om_name
      , w.TotalCases AS total_cases
      , w.TotalPoints AS total_points
      , w.NominalTarget AS nominal_target
      , w.ContractedHoursPerWeek AS contracted_hours 
      , w.hoursReduction AS hours_reduction
      , null
      , null
      FROM dbo.OffenderManager om
      WHERE om.Id NOT IN (SELECT OffenderManagerId FROM dbo.Note)`

      // cannot index with outer join 
      //var index = 'CREATE UNIQUE CLUSTERED INDEX idx_archive_view on dbo.archive_view (unique_identifier)'

  return knex.schema
    .raw('DROP VIEW IF EXISTS dbo.archive_view;')
    .raw('SET ARITHABORT ON')
    .raw(view)
    //.raw(index)
}