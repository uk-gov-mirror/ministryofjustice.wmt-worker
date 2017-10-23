const knex = require('../../../knex').appSchema
var Promise = require('bluebird').Promise

module.exports.insertDependencies = function (inserts) {
  return knex('workload_points').returning('id').insert({
    comm_tier_1: 0,
    comm_tier_2: 0,
    comm_tier_3: 0,
    comm_tier_4: 0,
    comm_tier_5: 0,
    comm_tier_6: 0,
    comm_tier_7: 0,
    cust_tier_1: 0,
    cust_tier_2: 0,
    cust_tier_3: 0,
    cust_tier_4: 0,
    cust_tier_5: 0,
    cust_tier_6: 0,
    cust_tier_7: 0,
    lic_tier_1: 0,
    lic_tier_2: 0,
    lic_tier_3: 0,
    lic_tier_4: 0,
    lic_tier_5: 0,
    lic_tier_6: 0,
    lic_tier_7: 0,
    user_id: 0,
    sdr: 0,
    sdr_conversion: 0,
    nominal_target_spo: 0,
    nominal_target_po: 0,
    default_contracted_hours_po: 0,
    default_contracted_hours_pso: 0,
    weighting_o: 0,
    weighting_w: 0,
    weighting_u: 0,
    weighting_arms_lic: 0,
    weighting_arms_comm: 0,
    paroms_enabled: 0,
    parom: 0,
    is_t2a: false
  })
  .then(function (ids) {
    inserts.push({table: 'workload_points', id: ids[0]})
    return knex('workload_points').returning('id').insert({
      comm_tier_1: 1,
      comm_tier_2: 2,
      comm_tier_3: 3,
      comm_tier_4: 4,
      comm_tier_5: 5,
      comm_tier_6: 6,
      comm_tier_7: 7,
      cust_tier_1: 8,
      cust_tier_2: 9,
      cust_tier_3: 10,
      cust_tier_4: 11,
      cust_tier_5: 12,
      cust_tier_6: 13,
      cust_tier_7: 14,
      lic_tier_1: 15,
      lic_tier_2: 16,
      lic_tier_3: 17,
      lic_tier_4: 18,
      lic_tier_5: 19,
      lic_tier_6: 20,
      lic_tier_7: 21,
      user_id: 0,
      sdr: 22,
      sdr_conversion: 23,
      nominal_target_spo: 24,
      nominal_target_po: 25,
      default_contracted_hours_po: 26,
      default_contracted_hours_pso: 27,
      weighting_o: 28,
      weighting_w: 29,
      weighting_u: 30,
      paroms_enabled: 1,
      parom: 31,
      weighting_arms_lic: 32,
      weighting_arms_comm: 33,
      is_t2a: false
    })
  })
  .then(function (ids) {
    inserts.push({table: 'workload_points', id: ids[0]})
    return knex('workload_points').returning('id').insert({
      comm_tier_1: 5,
      comm_tier_2: 6,
      comm_tier_3: 7,
      comm_tier_4: 8,
      comm_tier_5: 9,
      comm_tier_6: 10,
      comm_tier_7: 11,
      cust_tier_1: 12,
      cust_tier_2: 13,
      cust_tier_3: 14,
      cust_tier_4: 15,
      cust_tier_5: 16,
      cust_tier_6: 17,
      cust_tier_7: 18,
      lic_tier_1: 19,
      lic_tier_2: 20,
      lic_tier_3: 21,
      lic_tier_4: 22,
      lic_tier_5: 23,
      lic_tier_6: 23,
      lic_tier_7: 24,
      user_id: 0,
      sdr: 0,
      sdr_conversion: 0,
      nominal_target_spo: 0,
      nominal_target_po: 0,
      default_contracted_hours_po: 0,
      default_contracted_hours_pso: 0,
      weighting_o: 25,
      weighting_w: 26,
      weighting_u: 27,
      paroms_enabled: 0,
      parom: 0,
      weighting_arms_lic: 0,
      weighting_arms_comm: 0,
      is_t2a: true
    })
  })
    .then(function (ids) {
      inserts.push({table: 'workload_points', id: ids[0]})
      return inserts
    })
}

module.exports.removeDependencies = function (inserts) {
  inserts = inserts.reverse()
  return Promise.each(inserts, (insert) => {
    return knex(insert.table).where('id', insert.id).del()
  })
}
