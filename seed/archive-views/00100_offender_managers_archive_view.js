exports.seed = function(knex, Promise) {
    var view = `CREATE VIEW offender_managers_archive_view
    WITH SCHEMABINDING 
    AS
    SELECT
    om.Id AS om_id
    , om.UniqueIdentifier AS unique_identifier
    , om.OffenderManagerTypeId AS om_type_id
    , ouLdu.Name AS ldu_name
    , ouTeam.Name AS team_name
    , CONCAT(om.Forename, ' ', om.Surname) AS om_name
    , SUM(w.TotalCases) AS total_cases
    , SUM(w.TotalPoints) AS total_points
    , SUM(w.SDRPoints) AS sdr_points
    , SUM(w.SDRConversionPoints) AS sdr_conversion_points
    , SUM(w.PAROMSPoints) AS paroms_points
    , w.NominalTarget AS nominal_target
    , SUM(w.ContractedHoursPerWeek) AS contracted_hours 
    , SUM(w.hoursReduction) AS hours_reduction
    , COUNT_BIG(*) AS count
    FROM dbo.OffenderManager om
    JOIN dbo.Workload w ON om.Id = w.OffenderManagerId
    JOIN dbo.OrganisationalUnit ouTeam ON w.TeamId = ouTeam.Id
    JOIN dbo.OrganisationalUnit ouLdu ON w.LduId = ouLdu.Id
    GROUP BY om.Id, om.UniqueIdentifier, om.OffenderManagerTypeId, ouTeam.Name, ouLdu.Name,
    om.Forename, om.Surname, w.ContractedHoursPerWeek, w.NominalTarget`

    var index = `CREATE UNIQUE CLUSTERED INDEX idx_offender_managers_archive_view
    ON dbo.offender_managers_archive_view(om_id, team_name)`

    return knex.schema
    .raw('DROP VIEW IF EXISTS dbo.archive_data_view;')
    .raw('DROP VIEW IF EXISTS dbo.offender_managers_archive_view;')
    .raw('SET ARITHABORT ON')
    .raw(view)
    //.raw(index)
}