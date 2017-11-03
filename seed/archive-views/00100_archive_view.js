exports.seed = function (knex, Promise) {
  var view = `CREATE VIEW archive_view
    WITH SCHEMABINDING 
    AS 
    SELECT
      ouLdu.Name AS ldu_name,
      ouTeam.Name AS team_name,
      CONCAT(om.Forename, \' \', om.Surname) AS om_name,
      n.HoursReduced AS reduction
    FROM dbo.OffenderManager om 
      JOIN dbo.Workload w ON om.Id = w.OffenderManagerId
      JOIN dbo.OrganisationalUnit ouTeam ON w.TeamId = ouTeam.Id 
      JOIN dbo.OrganisationalUnit ouLdu ON w.TeamId = ouLdu.Id
      JOIN dbo.Note n ON om.Id = n.OffenderManagerId;`
    
      // w.TotalCases AS total_cases
      //GROUP BY ouLdu.Name, ouTeam.Name, CONCAT(om.Forename, \' \', om.Surname)


  // TODO: Index

  return knex.schema
    .raw(view)
}