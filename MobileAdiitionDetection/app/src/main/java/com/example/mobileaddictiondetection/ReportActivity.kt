package com.example.mobileadditiondetection

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.activity.ComponentActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class ReportActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_report)

        val avgUsage = findViewById<TextView>(R.id.avgUsage)
        val weeklyTopApp = findViewById<TextView>(R.id.weeklyTopApp)

        val usageDataCollector = UsageDataCollector()
        val stats = usageDataCollector.getUsageStats(this)

        if (stats.isNotEmpty()) {

            // 🔥 TOTAL TIME
            var total = 0L
            for (app in stats) {
                total += app.totalTimeInForeground
            }

            // 🔥 AVG (7 days)
            val avg = total / 7
            val h = avg / (1000 * 60 * 60)
            val m = (avg / (1000 * 60)) % 60

            avgUsage.text = "$h h $m m"

            // 🔥 TOP APP
            val top = stats.maxByOrNull { it.totalTimeInForeground }

            val name = try {
                val ai = packageManager.getApplicationInfo(top!!.packageName, 0)
                packageManager.getApplicationLabel(ai).toString()
            } catch (e: Exception) {
                top?.packageName ?: "N/A"
            }

            weeklyTopApp.text = name
        }

        // 🔥 BOTTOM NAV
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNav)
        bottomNav.selectedItemId = R.id.nav_report

        bottomNav.setOnItemSelectedListener {
            when (it.itemId) {
                R.id.nav_home -> {
                    startActivity(Intent(this, MainActivity::class.java))
                    true
                }
                R.id.nav_report -> true
                R.id.nav_settings -> {
                    startActivity(Intent(this, SettingsActivity::class.java))
                    true
                }
                else -> false
            }
        }
    }
}