package com.example.mobileadditiondetection

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.ComponentActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.example.mobileadditiondetection.R

class SettingsActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        val notif = findViewById<LinearLayout>(R.id.notificationsOption)
        val dark = findViewById<LinearLayout>(R.id.darkModeOption)
        val about = findViewById<LinearLayout>(R.id.aboutOption)

        // 🔥 CLICK EVENTS
        notif.setOnClickListener {
            Toast.makeText(this, "Notifications Enabled", Toast.LENGTH_SHORT).show()
        }

        dark.setOnClickListener {
            Toast.makeText(this, "Dark Mode Active", Toast.LENGTH_SHORT).show()
        }

        about.setOnClickListener {
            Toast.makeText(this, "Mobile Addiction Detector v1.0", Toast.LENGTH_LONG).show()
        }

        // 🔥 BOTTOM NAV
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNav)
        bottomNav.selectedItemId = R.id.nav_settings

        bottomNav.setOnItemSelectedListener {
            when (it.itemId) {
                R.id.nav_home -> {
                    startActivity(Intent(this, MainActivity::class.java))
                    true
                }
                R.id.nav_report -> {
                    startActivity(Intent(this, ReportActivity::class.java))
                    true
                }
                R.id.nav_settings -> true
                else -> false
            }
        }
    }
}