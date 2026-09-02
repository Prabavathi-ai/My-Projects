package com.example.mobileadditiondetection

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context

class UsageDataCollector {

    fun getUsageStats(context: Context): List<UsageStats> {

        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val endTime = System.currentTimeMillis()
        val startTime = endTime - (1000 * 60 * 60 * 24)

        val stats = usm.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime
        )

        return stats ?: emptyList()
    }
}