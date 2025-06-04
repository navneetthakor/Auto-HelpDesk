// creating express router object
const express = require('express');
const router = express.Router();

const fetchUser = require("../Middelwares/fetchUser.middelware");
const axios = require("axios");

const createResponse = require("../Response");


// Route to fetch metrics based on instance ID
router.get('/serverGraph/:jobId/:timeRange', fetchUser, async (req, res) => {
    try {

        const instanceId = req.user.id;

        const { jobId, timeRange } = req.params;

        // to generate start and end time 
        const times = generateTimeRangeFromParam(timeRange)


        // Fetch CPU usage data
        const cpuQuery = `http_Gauge_response_time_custom{instance="${instanceId}",job="${jobId}"}`;
        const resTimeData = await fetchPrometheusData(cpuQuery, times.startTime, times.endTime);

        // Fetch memory usage data
        const memoryQuery = `http_status_code_custom{instance="${instanceId}",job="${jobId}"}`;
        const statusCodeData = await fetchPrometheusData(memoryQuery, times.startTime, times.endTime);

        // const data to send 
        Data = {
            resTimeData: formatMetricData(resTimeData),
            statusCodeData: formatMetricData(statusCodeData)
        }
        return res.status(200).json(createResponse(Data, false, "", 200, ""))
        
    } catch (error) {
        console.error('Error fetching instance metrics:', error);
        res.status(500).json({ error: 'Failed to fetch instance metrics' });
    }
});


// Function to fetch data from Prometheus API in Grafana Cloud
async function fetchPrometheusData(query, start, end) {
    // Grafana Cloud API configuration
    const GRAFANA_URL = process.env.GRAFANA_URL;
    const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY;

    const now = Math.floor(Date.now() / 1000);
    const startTime = start || (now - 172800); // Default to 48 hours ago
    const endTime = end || now;                // Default to current time

    console.log(startTime);
    console.log(endTime);

    const response = await axios.get(`${GRAFANA_URL}/api/datasources/proxy/9/api/v1/query_range`, {
        params: {
            query,
            start: startTime,
            end: endTime,
            step: '60s' // 1 minute intervals
        },
        headers: {
            'Authorization': `Bearer ${GRAFANA_API_KEY}`
        }
    });

    console.log(response.data);

    return response.data;
}

// Format the metric data for frontend consumption
function formatMetricData(prometheusData) {
    if (!prometheusData.data || !prometheusData.data.result || prometheusData.data.result.length === 0) {
        return [];
    }

    return prometheusData.data.result.map(result => {
        const { metric, values } = result;

        return {
            metric: metric,
            values: values.map(([timestamp, value]) => ({
                timestamp: timestamp * 1000, // Convert to milliseconds for JS
                value: parseFloat(value)
            }))
        };
    });
}

function generateTimeRangeFromParam(timeRange) {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    let startTime;
    
    // Default in case of parsing failure
    startTime = now - (24 * 60 * 60); // Default to 24 hours
    
    if (timeRange) {
      // Extract the numeric part and the unit
      const matches = timeRange.match(/^(\d+)([mhdw])$/);
      
      if (matches && matches.length === 3) {
        const value = parseInt(matches[1]);
        const unit = matches[2];
        
        // Calculate start time based on unit
        switch (unit) {
          case 'm': // minutes
            startTime = now - (value * 60);
            break;
          case 'h': // hours
            startTime = now - (value * 60 * 60);
            break;
          case 'd': // days
            startTime = now - (value * 24 * 60 * 60);
            break;
          case 'w': // weeks
            startTime = now - (value * 7 * 24 * 60 * 60);
            break;
        }
      }
    }
    
    return {
      startTime,
      endTime: now
    };
  }

module.exports = router;


// POST https://<your_grafana_subdomain>.grafana.net/api/ds/query
// Headers:
//   Authorization: Bearer <API_KEY>
//   Content-Type: application/json

// Body:
// {
//   "queries": [
//     {
//       "refId": "A",
//       "datasource": { "type": "prometheus", "uid": "<DATASOURCE_UID>" },
//       "expr": "up",
//       "intervalMs": 1000,
//       "maxDataPoints": 500
//     }
//   ],
//   "range": {
//     "from": "2025-05-01T00:00:00Z",
//     "to": "2025-05-02T00:00:00Z"
//   }
// }
