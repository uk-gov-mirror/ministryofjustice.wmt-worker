const knex = require('../../../knex').appSchema
const Promise = require('bluebird').Promise

module.exports.insertDependencies = function (inserts) {
  const workloadPoints = module.exports.getWorkloadPoints()
  return knex('workload_points').returning('id').insert(workloadPoints)
    .then(function (ids) {
      ids.forEach((id) => {
        inserts.push({ table: 'workload_points', id: id })
      })
      return inserts
    }).catch((error) => {
      console.error(error)
      exports.removeDependencies(inserts)
    })
}

module.exports.removeDependencies = function (inserts) {
  inserts = inserts.reverse()
  return Promise.each(inserts, (insert) => {
    return knex(insert.table).where('id', insert.id).del()
  })
}

module.exports.getWorkloadPoints = function () {
  return [
    {
      comm_tier_1: 100,
      comm_tier_2: 90,
      comm_tier_3: 80,
      comm_tier_4: 70,
      comm_tier_5: 60,
      comm_tier_6: 50,
      comm_tier_7: 45,
      comm_tier_8: 40,
      comm_tier_9: 35,
      comm_tier_10: 30,
      comm_tier_11: 25,
      comm_tier_12: 20,
      comm_tier_13: 15,
      comm_tier_14: 10,
      comm_tier_15: 5,
      comm_tier_16: 2,
      cust_tier_1: 200,
      cust_tier_2: 190,
      cust_tier_3: 180,
      cust_tier_4: 170,
      cust_tier_5: 160,
      cust_tier_6: 150,
      cust_tier_7: 145,
      cust_tier_8: 140,
      cust_tier_9: 135,
      cust_tier_10: 130,
      cust_tier_11: 125,
      cust_tier_12: 120,
      cust_tier_13: 115,
      cust_tier_14: 110,
      cust_tier_15: 105,
      cust_tier_16: 102,
      lic_tier_1: 300,
      lic_tier_2: 290,
      lic_tier_3: 280,
      lic_tier_4: 270,
      lic_tier_5: 260,
      lic_tier_6: 250,
      lic_tier_7: 245,
      lic_tier_8: 240,
      lic_tier_9: 235,
      lic_tier_10: 230,
      lic_tier_11: 225,
      lic_tier_12: 220,
      lic_tier_13: 215,
      lic_tier_14: 210,
      lic_tier_15: 205,
      lic_tier_16: 202,
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
      weighting_arms_lic: 32,
      weighting_arms_comm: 33,
      paroms_enabled: 1,
      parom: 31,
      is_t2a: false,
      default_contracted_hours_spo: 0
    },
    {
      comm_tier_1: 20,
      comm_tier_2: 19,
      comm_tier_3: 18,
      comm_tier_4: 17,
      comm_tier_5: 16,
      comm_tier_6: 15,
      comm_tier_7: 14,
      comm_tier_8: 13,
      comm_tier_9: 12,
      comm_tier_10: 11,
      comm_tier_11: 10,
      comm_tier_12: 9,
      comm_tier_13: 8,
      comm_tier_14: 7,
      comm_tier_15: 6,
      comm_tier_16: 5,
      cust_tier_1: 40,
      cust_tier_2: 39,
      cust_tier_3: 38,
      cust_tier_4: 37,
      cust_tier_5: 36,
      cust_tier_6: 35,
      cust_tier_7: 34,
      cust_tier_8: 33,
      cust_tier_9: 32,
      cust_tier_10: 31,
      cust_tier_11: 30,
      cust_tier_12: 29,
      cust_tier_13: 28,
      cust_tier_14: 27,
      cust_tier_15: 26,
      cust_tier_16: 25,
      lic_tier_1: 60,
      lic_tier_2: 59,
      lic_tier_3: 58,
      lic_tier_4: 57,
      lic_tier_5: 56,
      lic_tier_6: 55,
      lic_tier_7: 54,
      lic_tier_8: 53,
      lic_tier_9: 52,
      lic_tier_10: 51,
      lic_tier_11: 50,
      lic_tier_12: 49,
      lic_tier_13: 48,
      lic_tier_14: 47,
      lic_tier_15: 46,
      lic_tier_16: 45,
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
      weighting_arms_lic: 0,
      weighting_arms_comm: 0,
      paroms_enabled: 0,
      parom: 0,
      is_t2a: true,
      default_contracted_hours_spo: 0
    }
  ]
}
