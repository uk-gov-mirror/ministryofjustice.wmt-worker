exports.seed = function(knex, Promise) {
    var view = `CREATE VIEW offender_managers_archive_view
    WITH SCHEMABINDING 
    AS
    SELECT
    om.Id AS om_id
    , w.Id AS workload_id
    , om.UniqueIdentifier AS unique_identifier
    , om.OffenderManagerTypeId AS om_type_id
    , w.LduId AS workload_ldu_id
    , ouTeam.Name AS team_name
    , om.Forename AS om_forename
    , om.Surname AS om_surname
    , w.TotalCases AS total_cases
    , w.TotalPoints AS total_points
    , w.SDRPoints AS sdr_points
    , w.SDRConversionPoints AS sdr_conversion_points
    , w.PAROMSPoints AS paroms_points
    , w.NominalTarget AS nominal_target
    , w.ContractedHoursPerWeek AS contracted_hours 
    , w.hoursReduction AS hours_reduction
    , COUNT_BIG(*) AS count
    FROM dbo.OffenderManager om
    JOIN dbo.Workload w ON om.Id = w.OffenderManagerId
    JOIN dbo.OrganisationalUnit ouTeam ON w.TeamId = ouTeam.Id
    GROUP BY om.Id, w.Id, om.UniqueIdentifier, om.OffenderManagerTypeId, ouTeam.Name, w.LduId,
    om.Forename, om.Surname, w.NominalTarget, w.TotalCases, w.TotalPoints, w.SDRPoints, 
    w.SDRConversionPoints, w.PAROMSPoints, w.ContractedHoursPerWeek, 
    w.hoursReduction`

    var index = `CREATE UNIQUE CLUSTERED INDEX idx_offender_managers_archive_view
    ON dbo.offender_managers_archive_view(workload_id)`

    return knex.schema
    .raw('DROP VIEW IF EXISTS dbo.archive_data_view;')
    .raw('DROP VIEW IF EXISTS dbo.offender_managers_archive_view;')
    .raw('SET ARITHABORT ON')
    .raw(view)
    .raw(index)
}