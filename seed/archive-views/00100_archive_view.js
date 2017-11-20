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
      JOIN dbo.Workload w ON om.Id = w.OffenderManagerId
      JOIN dbo.OrganisationalUnit ouTeam ON w.TeamId = ouTeam.Id 
      JOIN dbo.OrganisationalUnit ouLdu ON w.LduId = ouLdu.Id
      LEFT JOIN dbo.Note n ON om.Id = n.OffenderManagerId
      GROUP BY om.UniqueIdentifier, ouLdu.Name, ouTeam.Name, CONCAT(om.Forename, \' \', om.Surname), w.TotalCases, 
      w.TotalPoints, w.NominalTarget, w.ContractedHoursPerWeek, w.hoursReduction, n.HoursReduced, n.Notes;`

  // TODO: Index

  return knex.schema
    .raw(view)
}