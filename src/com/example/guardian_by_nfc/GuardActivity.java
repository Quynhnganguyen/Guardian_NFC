package com.example.guardian_by_nfc;

import org.apache.cordova.DroidGap;
import android.os.Bundle;
import android.view.Menu;

public class GuardActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/index.html");}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.guard, menu);
		return true;
	}

}
