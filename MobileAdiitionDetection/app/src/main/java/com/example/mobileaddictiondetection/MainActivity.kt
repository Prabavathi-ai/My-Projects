package com.example.mobileadditiondetection

import android.Manifest
import android.app.AppOpsManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.*
import androidx.activity.ComponentActivity
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.example.mobileadditiondetection.R
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.data.*
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.github.mikephil.charting.components.XAxis

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val refreshBtn = findViewById<Button>(R.id.refreshBtn)
        refreshBtn.setOnClickListener { recreate() }

        requestNotificationPermission()

        if (!hasUsagePermission()) {
            startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            return
        }

        // 🔥 UI
        val screenTimeText = findViewById<TextView>(R.id.screenTime)
        val socialText = findViewById<TextView>(R.id.socialUsage)
        val riskText = findViewById<TextView>(R.id.riskScore)
        val statusText = findViewById<TextView>(R.id.status)
        val peakText = findViewById<TextView>(R.id.peakApp)
        val topAppsTextView = findViewById<TextView>(R.id.topApps)
        val recText = findViewById<TextView>(R.id.recommendations)
        val barChart = findViewById<BarChart>(R.id.barChart)

        val usageDataCollector = UsageDataCollector()
        val stats = usageDataCollector.getUsageStats(this)

        if (stats.isEmpty()) {
            screenTimeText.text = "No usage data"
            return
        }

        var totalTime = 0L
        var socialTime = 0L

        val socialApps = listOf(
            "com.instagram.android",
            "com.whatsapp",
            "com.facebook.katana",
            "com.snapchat.android",
            "com.twitter.android",
            "com.google.android.youtube"
        )

        for (app in stats) {
            totalTime += app.totalTimeInForeground
            if (socialApps.contains(app.packageName)) {
                socialTime += app.totalTimeInForeground
            }
        }

        val hours = totalTime / (1000 * 60 * 60)
        val minutes = (totalTime / (1000 * 60)) % 60

        val socialPercent = if (totalTime > 0) ((socialTime * 100) / totalTime) else 0

        val riskScore = when {
            hours < 3 -> 20
            hours < 5 -> 40
            hours < 7 -> 60
            else -> 80
        }

        val status = when {
            riskScore <= 30 -> "Healthy"
            riskScore <= 60 -> "Moderate"
            else -> "High Risk"
        }

        // 🔥 FILTER APPS
        val filteredApps = stats.filter {
            val pkg = it.packageName

            !pkg.startsWith("com.android") &&
                    !pkg.startsWith("android") &&
                    !pkg.startsWith("com.google.android.gms") &&
                    !pkg.contains("systemui") &&
                    !pkg.contains("launcher")
        }

        // 🔥 MERGE APPS PROPERLY (NO ERROR)
        val mergedApps = filteredApps
            .groupBy { it.packageName }
            .map { entry ->
                val totalTime = entry.value.sumOf { it.totalTimeInForeground }
                Pair(entry.value[0], totalTime)
            }

// 🔥 SORT
        val sortedApps = mergedApps.sortedByDescending { it.second }

// 🔥 TOP 5
        val topApps = sortedApps.take(5)

        // 🔥 TOP APPS TEXT
        var topAppsText = ""

        for ((index, app) in topApps.withIndex()) {

            val name = try {
                val ai = packageManager.getApplicationInfo(app.first.packageName, 0)
                packageManager.getApplicationLabel(ai).toString()
            } catch (e: Exception) {
                app.first.packageName
                    .substringAfterLast(".")
                    .replaceFirstChar { it.uppercase() }
            }

            val h = app.second / (1000 * 60 * 60)
            val m = (app.second / (1000 * 60)) % 60

            topAppsText += "${index + 1}. $name - ${h}h ${m}m\n"
        }

        // 🔥 GRAPH
        val entries = ArrayList<BarEntry>()
        val labels = ArrayList<String>()

        for ((index, app) in topApps.withIndex()) {

            val h = app.second / (1000f * 60 * 60)
            entries.add(BarEntry(index.toFloat(), h))

            val name = try {
                val ai = packageManager.getApplicationInfo(app.first.packageName, 0)
                packageManager.getApplicationLabel(ai).toString()
            } catch (e: Exception) {
                app.first.packageName.substringAfterLast(".")
            }

            labels.add(name)
        }

        val dataSet = BarDataSet(entries, "Usage (hours)")
        dataSet.valueTextSize = 12f
        dataSet.color = ContextCompat.getColor(this, R.color.text_primary)
        dataSet.valueTextColor = ContextCompat.getColor(this, R.color.text_primary)

        val data = BarData(dataSet)
        barChart.data = data

        val xAxis = barChart.xAxis
        xAxis.valueFormatter = IndexAxisValueFormatter(labels)
        xAxis.granularity = 1f
        xAxis.position = XAxis.XAxisPosition.BOTTOM
        xAxis.textColor = ContextCompat.getColor(this, R.color.text_primary)
        xAxis.setDrawGridLines(false)

        val leftAxis = barChart.axisLeft
        leftAxis.textColor = ContextCompat.getColor(this, R.color.text_primary)
        leftAxis.setDrawGridLines(false)

        barChart.axisRight.isEnabled = false
        barChart.description.isEnabled = false

        barChart.setBackgroundColor(
            ContextCompat.getColor(this, R.color.card_bg)
        )

        barChart.legend.textColor = ContextCompat.getColor(this, R.color.text_primary)

        barChart.animateY(1000)
        barChart.invalidate()

        // 🔥 PEAK APP
        val peakAppName = try {
            val top = topApps.firstOrNull()
            if (top != null) {
                val ai = packageManager.getApplicationInfo(top.first.packageName, 0)
                packageManager.getApplicationLabel(ai).toString()
            } else "N/A"
        } catch (e: Exception) {
            "N/A"
        }

        // 🔥 NOTIFICATIONS
        if (hours >= 6) {
            sendNotification("Mobile Addiction Alert", "Screen time exceeded 6 hours")
        }

        // 🔥 RECOMMENDATIONS
        var recommendations = ""
        if (hours >= 7) recommendations += "• Reduce screen time\n"
        if (socialPercent > 40) recommendations += "• Reduce social media\n"
        if (riskScore > 60) recommendations += "• Enable focus mode\n"

        // 🔥 SET TEXT
        screenTimeText.text = "$hours h $minutes m"
        socialText.text = "Social Media: $socialPercent %"
        riskText.text = "Risk Score: $riskScore / 100"
        statusText.text = "Status: $status"
        peakText.text = "Peak App: $peakAppName"
        topAppsTextView.text = topAppsText
        recText.text = recommendations
        val bottomNav = findViewById<com.google.android.material.bottomnavigation.BottomNavigationView>(R.id.bottomNav)

        bottomNav.setOnItemSelectedListener {

            when (it.itemId) {

                R.id.nav_home -> true

                R.id.nav_report -> {
                    startActivity(Intent(this, ReportActivity::class.java))
                    true
                }

                R.id.nav_settings -> {
                    startActivity(Intent(this, SettingsActivity::class.java))
                    true
                }

                else -> false
            }
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    101
                )
            }
        }
    }

    private fun sendNotification(title: String, message: String) {
        val channelId = "usage_alert_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Usage Alerts",
                NotificationManager.IMPORTANCE_HIGH
            )
            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(channel)
        }

        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(message)

        NotificationManagerCompat.from(this)
            .notify((0..1000).random(), builder.build())
    }

    private fun hasUsagePermission(): Boolean {
        val appOps = getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager

        val mode = appOps.checkOpNoThrow(
            "android:get_usage_stats",
            android.os.Process.myUid(),
            packageName
        )

        return mode == AppOpsManager.MODE_ALLOWED
    }
}