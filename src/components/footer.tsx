export default function Footer() {
    return (
        <footer className="border-t bg-secondary/50">
            <div className="container mx-auto py-6 text-center text-sm text-foreground/60">
                <p>&copy; {new Date().getFullYear()} SmartSetu. All rights reserved.</p>
            </div>
        </footer>
    )
}
