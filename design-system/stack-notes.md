# Stack Implementation Guidelines (UI/UX Pro Max)

## UI Pro Max Stack Guidelines
**Stack:** flutter | **Query:** form layout theming
**Source:** stacks/flutter.csv | **Found:** 10 results

### Result 1
- **Category:** Forms
- **Guideline:** Use Form widget
- **Description:** Form validation
- **Do:** Form with GlobalKey
- **Don't:** Individual validation
- **Code Good:** Form(key: _formKey child: ...)
- **Code Bad:** TextField without Form
- **Severity:** Medium
- **Docs URL:** https://api.flutter.dev/flutter/widgets/Form-class.html

### Result 2
- **Category:** Theming
- **Guideline:** Use ThemeData
- **Description:** Consistent theming
- **Do:** ThemeData for app theme
- **Don't:** Hardcoded colors
- **Code Good:** Theme.of(context).primaryColor
- **Code Bad:** Color(0xFF123456) everywhere
- **Severity:** Medium
- **Docs URL:** https://api.flutter.dev/flutter/material/ThemeData-class.html

### Result 3
- **Category:** Forms
- **Guideline:** Validate on submit
- **Description:** Form validation flow
- **Do:** _formKey.currentState!.validate()
- **Don't:** Skip validation
- **Code Good:** if (_formKey.currentState!.validate())
- **Code Bad:** Submit without validation
- **Severity:** High
- **Docs URL:** 

### Result 4
- **Category:** Layout
- **Guideline:** Use Column and Row
- **Description:** Basic layout widgets
- **Do:** Column Row for linear layouts
- **Don't:** Stack for simple layouts
- **Code Good:** Column(children: [Text(), Button()])
- **Code Bad:** Stack for vertical list
- **Severity:** Medium
- **Docs URL:** https://api.flutter.dev/flutter/widgets/Column-class.html

### Result 5
- **Category:** Theming
- **Guideline:** Use ColorScheme
- **Description:** Material 3 color system
- **Do:** ColorScheme for colors
- **Don't:** Individual color properties
- **Code Good:** colorScheme: ColorScheme.fromSeed()
- **Code Bad:** primaryColor: Colors.blue
- **Severity:** Medium
- **Docs URL:** 

### Result 6
- **Category:** Theming
- **Guideline:** Support dark mode
- **Description:** Respect system theme
- **Do:** darkTheme in MaterialApp
- **Don't:** Light theme only
- **Code Good:** MaterialApp(theme: light, darkTheme: dark)
- **Code Bad:** MaterialApp(theme: light)
- **Severity:** Medium
- **Docs URL:** 

### Result 7
- **Category:** Theming
- **Guideline:** Access theme via context
- **Description:** Dynamic theme access
- **Do:** Theme.of(context)
- **Don't:** Static theme reference
- **Code Good:** Theme.of(context).textTheme.bodyLarge
- **Code Bad:** TextStyle(fontSize: 16)
- **Severity:** Medium
- **Docs URL:** 

### Result 8
- **Category:** Layout
- **Guideline:** Use SizedBox for spacing
- **Description:** Consistent spacing
- **Do:** SizedBox for gaps
- **Don't:** Container for spacing only
- **Code Good:** SizedBox(height: 16)
- **Code Bad:** Container(height: 16)
- **Severity:** Low
- **Docs URL:** 

### Result 9
- **Category:** Layout
- **Guideline:** Avoid deep nesting
- **Description:** Keep widget tree shallow
- **Do:** Extract deeply nested widgets
- **Don't:** 10+ levels of nesting
- **Code Good:** Extract widget to method or class
- **Code Bad:** Column(Row(Column(Row(...))))
- **Severity:** Medium
- **Docs URL:** 

### Result 10
- **Category:** Layout
- **Guideline:** Use Expanded and Flexible
- **Description:** Control flex behavior
- **Do:** Expanded to fill space
- **Don't:** Fixed sizes in flex containers
- **Code Good:** Expanded(child: Container())
- **Code Bad:** Container(width: 200) in Row
- **Severity:** Medium
- **Docs URL:** 


---

## UI Pro Max Stack Guidelines
**Stack:** nextjs | **Query:** landing hero gallery
**Source:** stacks/nextjs.csv | **Found:** 1 results

### Result 1
- **Category:** Images
- **Guideline:** Use priority for LCP images
- **Description:** Mark above-fold images as priority
- **Do:** priority prop on hero images
- **Don't:** All images with priority
- **Code Good:** <Image priority src={hero}/>
- **Code Bad:** <Image priority/> on every image
- **Severity:** Medium
- **Docs URL:** 


---

## UI Pro Max Stack Guidelines
**Stack:** shadcn | **Query:** admin table filters
**Source:** stacks/shadcn.csv | **Found:** 4 results

### Result 1
- **Category:** Table
- **Guideline:** Use Table for data display
- **Description:** Table component for structured data
- **Do:** Table for tabular data display
- **Don't:** Div grid for table-like layouts
- **Code Good:** <Table><TableHeader><TableBody><TableRow>
- **Code Bad:** <div className="grid">
- **Severity:** Medium
- **Docs URL:** https://ui.shadcn.com/docs/components/table

### Result 2
- **Category:** Table
- **Guideline:** Include proper table structure
- **Description:** Use TableHeader TableBody TableRow TableCell
- **Do:** Semantic table structure
- **Don't:** Missing thead or tbody
- **Code Good:** <TableHeader><TableRow><TableHead>
- **Code Bad:** <Table><TableRow> without header
- **Severity:** High
- **Docs URL:** https://ui.shadcn.com/docs/components/table

### Result 3
- **Category:** DataTable
- **Guideline:** Use DataTable for complex tables
- **Description:** Combine Table with TanStack Table for features
- **Do:** DataTable pattern for sorting filtering pagination
- **Don't:** Custom table implementation
- **Code Good:** useReactTable + Table components
- **Code Bad:** Custom sort filter pagination logic
- **Severity:** Medium
- **Docs URL:** https://ui.shadcn.com/docs/components/data-table

### Result 4
- **Category:** Sheet
- **Guideline:** Use Sheet for side panels
- **Description:** Sheet component for slide-out panels and drawers
- **Do:** Sheet for navigation filters settings
- **Don't:** Dialog for side content
- **Code Good:** <Sheet side="right">
- **Code Bad:** <Dialog> with slide animation
- **Severity:** Medium
- **Docs URL:** https://ui.shadcn.com/docs/components/sheet

